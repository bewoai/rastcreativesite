(function () {
  const IMAGE_LIMIT_BYTES = 1024 * 1024;
  const IMAGE_LIMIT_LABEL = "1 MB";
  const IMAGE_RECOMMENDATION =
    "Lutfen gorseli WebP/JPG olarak 1600px genislik civarinda sikistirin. Onerilen aralik 200-700 KB.";

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes)) return "bilinmeyen boyut";
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  function warn(message) {
    window.alert(message);
  }

  document.addEventListener(
    "change",
    function (event) {
      const input = event.target;

      if (!(input instanceof HTMLInputElement) || input.type !== "file" || !input.files) {
        return;
      }

      const oversizedImage = Array.from(input.files).find(function (file) {
        return file.type.startsWith("image/") && file.size > IMAGE_LIMIT_BYTES;
      });

      if (!oversizedImage) return;

      event.preventDefault();
      event.stopPropagation();
      input.value = "";

      warn(
        `Gorsel yukleme limiti ${IMAGE_LIMIT_LABEL}.\n\nSectiginiz dosya: ${oversizedImage.name} (${formatBytes(
          oversizedImage.size,
        )}).\n\n${IMAGE_RECOMMENDATION}`,
      );
    },
    true,
  );
})();
