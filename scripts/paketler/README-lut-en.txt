RAST LUT PACK
Rast Creative Studio — rastcreative.com
https://rastcreative.com/en/tools/free-lut-pack/

12 free .cube LUTs (33x33x33) in two folders:

  Looks/          8 creative looks for Rec.709 (normal, color) footage
  Log-to-Rec709/  4 conversion LUTs that turn log footage into normal Rec.709

LOG TO REC.709 (Log-to-Rec709/)
  rast-slog3-to-rec709.cube     Sony S-Log3 / S-Gamut3.Cine
  rast-vlog-to-rec709.cube      Panasonic V-Log / V-Gamut
  rast-clog3-to-rec709.cube     Canon C-Log3 / Cinema Gamut
  rast-applelog-to-rec709.cube  Apple Log (iPhone 15 Pro and later, Rec.2020 gamut)

  These are Rast's own conversion LUTs, built from the manufacturers' published log curve
  and gamut specifications (decode > gamut to Rec.709 > soft gamut compression > gentle
  filmic tone curve with highlight roll-off). They are NOT official Sony, Panasonic, Canon
  or Apple LUTs. 18% grey lands at about 0.435 (Rec.709, gamma 2.4) and stays neutral.
  Use them at 100% as the FIRST step; set white balance and exposure before the LUT.
  Input = the camera's normal code values, the same convention as the makers' own LUTs.
  No DJI D-Log M LUT: DJI has not published the D-Log M curve, so use DJI's own LUT for it.

LOOKS (Looks/, file names of the first five are Turkish)
  rast-sicak-film.cube        Warm Film: soft blacks, warm highlights, gentle film contrast
  rast-soguk-gece.cube        Cool Night: cool shadows, slightly lower exposure, night/city mood
  rast-dogal-kontrast.cube    Natural Contrast: neutral, a bit more lively contrast; leaves skin alone
  rast-soluk-matte.cube       Faded Matte: lifted blacks, soft whites, lower saturation
  rast-altin-saat-hafif.cube  Subtle Golden Hour: light golden-hour warmth, slightly richer oranges/yellows
  rast-teal-orange.cube       Teal & Orange: cool teal shadows, warm highlights, skin kept natural
  rast-mono-kontrast.cube     Mono Contrast: black & white with firm contrast
  rast-bleach-bypass.cube     Bleach Bypass: low saturation, hard contrast, silver film feel

The color looks are built to protect skin tones (color shift in the skin-tone range is limited).
Tip: 50–80% intensity usually gives the most natural result.
Shot in log? Apply the matching Log-to-Rec709 LUT first, then a look on top of it.

HOW TO USE
  Premiere Pro: Lumetri Color > Creative > Look > Browse... > pick the .cube file.
               Adjust strength with the Intensity slider. Log conversion LUT: Basic Correction > Input LUT.
  DaVinci Resolve: Project Settings > Color Management > Open LUT Folder; copy the folders in,
               then "Update Lists". On the Color page: right-click a node > 3D LUT > Rast.
  Final Cut Pro: Effects > Color > Custom LUT > LUT > Choose Custom LUT... > .cube.
  CapCut (desktop, Windows/Mac): Adjustment > LUT > Import; choose the .cube files, apply the LUT
               to the clip (or as an adjustment layer) and set Intensity. The CapCut phone app
               has no custom LUT import: apply the LUT on desktop, or in another app first.

LICENSE
  Creative Commons Attribution 4.0 (CC BY 4.0) — https://creativecommons.org/licenses/by/4.0/
  Use and modify them, including commercial work and client projects.
  Condition: credit. Example: "Color LUT: Rast Creative Studio — rastcreative.com"
  Don't resell the LUT files as is or redistribute them as another pack.
  LISANS-CC-BY-4.0.txt is the full license text; OKU-BENI.txt is this readme in Turkish.
  Camera and app names are trademarks of their owners; no affiliation.

Rast Creative Studio — video production, color and editing, Sakarya, Turkey.
https://rastcreative.com
