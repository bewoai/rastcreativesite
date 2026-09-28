"""
Çekim Günü — papercraft 3D kit (Blender / bpy).
Faceted, flat-shaded paper figures: prism torsos, thin block limbs, angular heads with a
wedge nose; crumpled-paper material; paper-strip grass; spot + fog + depth of field.
"""
import bpy, bmesh, math, random
from mathutils import Vector, Matrix

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    s = bpy.context.scene
    s.render.engine = "CYCLES"
    s.cycles.device = "CPU"
    s.cycles.samples = 48
    s.cycles.use_denoising = True
    s.cycles.denoiser = "OPENIMAGEDENOISE"
    s.cycles.max_bounces = 4
    s.render.resolution_x, s.render.resolution_y = 540, 960
    s.render.film_transparent = False
    s.view_settings.view_transform = "AgX"
    s.view_settings.look = "AgX - Punchy"
    return s

# ───────── materials ─────────
_M = {}
def paper(name, color, rough=0.85, bump=0.35, crumple=6.0, emit=None):
    key = (name, color)
    if key in _M: return _M[key]
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; L = nt.links
    b = N["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    # crumpled paper: voronoi facets + fine noise → bump
    tc = N.new("ShaderNodeTexCoord")
    vo = N.new("ShaderNodeTexVoronoi"); vo.inputs["Scale"].default_value = crumple; vo.feature = "F1"; vo.distance = "EUCLIDEAN"
    no = N.new("ShaderNodeTexNoise"); no.inputs["Scale"].default_value = 60; no.inputs["Detail"].default_value = 4
    mx = N.new("ShaderNodeMath"); mx.operation = "ADD"
    mu = N.new("ShaderNodeMath"); mu.operation = "MULTIPLY"; mu.inputs[1].default_value = 0.25
    bp = N.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = bump; bp.inputs["Distance"].default_value = 0.02
    L.new(tc.outputs["Object"], vo.inputs["Vector"]); L.new(tc.outputs["Object"], no.inputs["Vector"])
    L.new(vo.outputs["Distance"], mx.inputs[0]); L.new(no.outputs["Fac"], mu.inputs[0]); L.new(mu.outputs[0], mx.inputs[1])
    L.new(mx.outputs[0], bp.inputs["Height"]); L.new(bp.outputs["Normal"], b.inputs["Normal"])
    if emit:
        b.inputs["Emission Color"].default_value = (*emit[0], 1); b.inputs["Emission Strength"].default_value = emit[1]
    _M[key] = m
    return m

def hexc(h):
    h = h.lstrip("#"); r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    lin = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (lin(r), lin(g), lin(b))

# ───────── mesh helpers ─────────
def mesh_obj(name, verts, faces, mat, parent=None, loc=(0, 0, 0)):
    me = bpy.data.meshes.new(name); me.from_pydata(verts, [], faces); me.update()
    ob = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(ob)
    ob.data.materials.append(mat); ob.location = loc
    if parent: ob.parent = parent
    return ob

def prism(name, top, bot, h, depth_top, depth_bot, mat, parent=None, loc=(0, 0, 0)):
    """Tapered block: top/bot are half-widths (x), depth are half-depths (y); z from 0 down to -h."""
    v = [(-top, -depth_top, 0), (top, -depth_top, 0), (top, depth_top, 0), (-top, depth_top, 0),
         (-bot, -depth_bot, -h), (bot, -depth_bot, -h), (bot, depth_bot, -h), (-bot, depth_bot, -h)]
    f = [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
    return mesh_obj(name, v, f, mat, parent, loc)

def box(name, sx, sy, sz, mat, parent=None, loc=(0, 0, 0)):
    x, y, z = sx / 2, sy / 2, sz / 2
    return prism(name, x, x, sz, y, y, mat, parent, (loc[0], loc[1], loc[2] + z))

def empty(name, parent=None, loc=(0, 0, 0)):
    e = bpy.data.objects.new(name, None); bpy.context.collection.objects.link(e); e.location = loc
    if parent: e.parent = parent
    return e

def lowsphere(name, r, mat, parent=None, loc=(0, 0, 0), seg=8, rings=5, scale=(1, 1, 1)):
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=rings, radius=r)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(ob); ob.data.materials.append(mat)
    ob.location = loc; ob.scale = scale
    if parent: ob.parent = parent
    return ob

# ───────── the figures ─────────
SKIN = hexc("#e8b48c")
def figure(name, kind="A"):
    """kind A: black cap, shades, goatee, black tee, jeans · B: beard, beige tee, watch, crossed arms."""
    R = {}
    root = empty(name); R["root"] = root
    shirt = paper(f"{name}_shirt", hexc("#1d1c22") if kind == "A" else hexc("#d9c4a0"))
    pants = paper(f"{name}_pants", hexc("#2c3a55") if kind == "A" else hexc("#2a2a30"))
    skin = paper("skin", SKIN, bump=0.2)
    dark = paper("hair", hexc("#241915"), bump=0.25)
    shoe = paper(f"{name}_shoe", hexc("#f2f0ea") if kind == "A" else hexc("#1c1c20"))
    bulk = 1.25 if kind == "B" else 1.0
    # legs: wide paper trousers (flared prisms)
    hips = empty(f"{name}_hips", root, (0, 0, 0.95)); R["hips"] = hips
    for s in (-1, 1):
        leg = empty(f"{name}_leg{s}", hips, (s * 0.11 * bulk, 0, 0))
        prism(f"{name}_pant{s}", 0.1 * bulk, 0.12 * bulk, 0.86, 0.1, 0.12, pants, leg)
        box(f"{name}_shoe{s}", 0.13, 0.28, 0.08, shoe, leg, (0, -0.05, -0.95))
        R[f"leg{s}"] = leg
    # torso: a tapered paper box, shoulders wider than waist
    torso = empty(f"{name}_torso", hips, (0, 0, 0.0)); R["torso"] = torso
    prism(f"{name}_chest", 0.27 * bulk, 0.2 * bulk, 0.62, 0.15 * bulk, 0.13 * bulk, shirt, torso, (0, 0, 0.64))
    # neck + head: angular block head with a wedge nose
    head = empty(f"{name}_head", torso, (0, 0, 0.7)); R["head"] = head
    box(f"{name}_neck", 0.09, 0.09, 0.08, skin, head, (0, 0, -0.04))
    prism(f"{name}_skull", 0.11, 0.1, 0.27, 0.12, 0.1, skin, head, (0, 0, 0.3))
    # nose wedge
    mesh_obj(f"{name}_nose", [(-0.022, -0.1, 0.19), (0.022, -0.1, 0.19), (0, -0.15, 0.11), (-0.028, -0.1, 0.1), (0.028, -0.1, 0.1)],
             [(0, 1, 2), (0, 2, 3), (1, 4, 2), (3, 2, 4)], skin, head)
    white = paper("glasswhite", hexc("#f5f3ee"), bump=0.05)
    ink = paper("ink", hexc("#141216"), bump=0.05)
    if kind == "A":
        cap = paper(f"{name}_cap", hexc("#1b1a20"))
        lowsphere(f"{name}_capdome", 0.125, cap, head, (0, 0.005, 0.28), seg=8, rings=4, scale=(1, 1.05, 0.55))
        box(f"{name}_brim", 0.2, 0.13, 0.02, cap, head, (0, -0.15, 0.26))
        for s in (-1, 1):   # wayfarer shades: dark lenses
            box(f"{name}_lens{s}", 0.075, 0.015, 0.045, ink, head, (s * 0.045, -0.1, 0.17))
        box(f"{name}_bridge", 0.03, 0.012, 0.01, ink, head, (0, -0.1, 0.2))
        box(f"{name}_goatee", 0.05, 0.03, 0.05, dark, head, (0, -0.095, 0.02))
        box(f"{name}_stache", 0.08, 0.02, 0.012, dark, head, (0, -0.1, 0.085))
    else:
        box(f"{name}_hairtop", 0.24, 0.24, 0.06, dark, head, (0, 0.01, 0.27))
        box(f"{name}_quiff", 0.18, 0.08, 0.06, dark, head, (0, -0.08, 0.3))
        prism(f"{name}_beard", 0.115, 0.07, 0.12, 0.125, 0.09, dark, head, (0, 0.005, 0.1))
        box(f"{name}_mouth", 0.05, 0.012, 0.01, paper("mouth", hexc("#5a1c24")), head, (0, -0.126, 0.065))
        for s in (-1, 1):   # glasses dots like the reference: white discs with dark pupils
            lowsphere(f"{name}_eye{s}", 0.022, white, head, (s * 0.045, -0.105, 0.17), seg=8, rings=4, scale=(1, 0.4, 1))
            lowsphere(f"{name}_pup{s}", 0.009, ink, head, (s * 0.045, -0.115, 0.17), seg=6, rings=3)
    # arms: thin blocks; B keeps them crossed
    for s in (-1, 1):
        sh = empty(f"{name}_sh{s}", torso, (s * 0.3 * bulk, 0, 0.6)); R[f"sh{s}"] = sh
        prism(f"{name}_sleeve{s}", 0.075 * bulk, 0.07 * bulk, 0.16, 0.07 * bulk, 0.065 * bulk, shirt, sh)
        prism(f"{name}_upper{s}", 0.045 * bulk, 0.04 * bulk, 0.3, 0.045 * bulk, 0.04 * bulk, skin, sh, (0, 0, -0.1))
        el = empty(f"{name}_el{s}", sh, (0, 0, -0.38)); R[f"el{s}"] = el
        prism(f"{name}_fore{s}", 0.04 * bulk, 0.035 * bulk, 0.27, 0.04 * bulk, 0.035 * bulk, skin, el)
        lowsphere(f"{name}_hand{s}", 0.05, skin, el, (0, 0, -0.3), seg=6, rings=4, scale=(0.9, 1, 1.1))
        if kind == "B" and s < 0:
            box(f"{name}_watch", 0.1 * bulk, 0.1 * bulk, 0.035, paper("silver", hexc("#cfd4da"), rough=0.35, bump=0.05), el, (0, 0, -0.26))
    return R

def pose_arm(R, s, fwd=0.0, out=0.0, elbow=0.0, twist=0.0):
    R[f"sh{s}"].rotation_euler = (fwd, twist, -s * out)
    R[f"el{s}"].rotation_euler = (elbow, 0, 0)

# ───────── world: dark stadium night, fog, grass ─────────
def night_world(color="#0b1330", strength=0.35, fog=0.035):
    w = bpy.data.worlds.new("night"); bpy.context.scene.world = w; w.use_nodes = True
    bg = w.node_tree.nodes["Background"]; bg.inputs["Color"].default_value = (*hexc(color), 1); bg.inputs["Strength"].default_value = strength
    if fog:
        vs = w.node_tree.nodes.new("ShaderNodeVolumeScatter"); vs.inputs["Density"].default_value = fog; vs.inputs["Anisotropy"].default_value = 0.5
        w.node_tree.links.new(vs.outputs["Volume"], w.node_tree.nodes["World Output"].inputs["Volume"])

def grass_field(size=6.0, n=9000, seed=2, color="#3fae3a"):
    rnd = random.Random(seed)
    ground = mesh_obj("ground", [(-30, -30, 0), (30, -30, 0), (30, 30, 0), (-30, 30, 0)], [(0, 1, 2, 3)], paper("soil", hexc("#1f4a1c")))
    verts, faces = [], []
    for i in range(n):
        x, y = (rnd.random() - 0.5) * size, (rnd.random() - 0.5) * size * 1.6 - 1.2
        h = 0.05 + rnd.random() * 0.07; w = 0.012 + rnd.random() * 0.01; a = rnd.random() * math.pi
        lean = (rnd.random() - 0.5) * 0.04
        dx, dy = math.cos(a) * w, math.sin(a) * w
        b = len(verts)
        verts += [(x - dx, y - dy, 0), (x + dx, y + dy, 0), (x + dx * 0.4 + lean, y + dy * 0.4, h), (x - dx * 0.4 + lean, y - dy * 0.4, h)]
        faces.append((b, b + 1, b + 2, b + 3))
    g = mesh_obj("grass", verts, faces, paper("grass", hexc(color), rough=0.7, bump=0.5, crumple=40))
    return g

def camera(loc, look, lens=50, fstop=2.0, focus=None):
    cd = bpy.data.cameras.new("cam"); cd.lens = lens
    cam = bpy.data.objects.new("cam", cd); bpy.context.collection.objects.link(cam); bpy.context.scene.camera = cam
    cam.location = loc
    d = Vector(look) - Vector(loc); cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    cd.dof.use_dof = True; cd.dof.aperture_fstop = fstop; cd.dof.focus_distance = focus or d.length
    return cam

def spot(loc, look, energy=800, size=0.6, color="#fff1dc", angle=50):
    ld = bpy.data.lights.new("spot", "SPOT"); ld.energy = energy; ld.shadow_soft_size = size; ld.color = hexc(color); ld.spot_size = math.radians(angle); ld.spot_blend = 0.6
    ob = bpy.data.objects.new("spot", ld); bpy.context.collection.objects.link(ob); ob.location = loc
    ob.rotation_euler = (Vector(look) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return ob

def area(loc, look, energy=200, size=2, color="#9fb8ff"):
    ld = bpy.data.lights.new("area", "AREA"); ld.energy = energy; ld.size = size; ld.color = hexc(color)
    ob = bpy.data.objects.new("area", ld); bpy.context.collection.objects.link(ob); ob.location = loc
    ob.rotation_euler = (Vector(look) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return ob

def bokeh_lights(n=14, seed=4, z=(2, 5), dist=(-14, -8)):
    rnd = random.Random(seed)
    for i in range(n):
        col = rnd.choice(["#fff1c8", "#ffd49a", "#cfe0ff", "#ff9a7a"])
        lowsphere(f"bk{i}", 0.08, paper(f"bk{col}", hexc(col), emit=(hexc(col), 30)), None, ((rnd.random() - 0.5) * 10, rnd.uniform(*dist), rnd.uniform(*z)), seg=8, rings=5)
