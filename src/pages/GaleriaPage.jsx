import { useState, useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import { uploadPhotos, getGalleryPhotos } from "../api";
import "../components/Styles/GaleriaPage.css";

export default function GaleriaPage() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [gallery, setGallery] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const uploadSectionRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const timeline = createTimeline({
      defaults: { ease: "out(3)" }
    });

    timeline
      .add(titleRef.current, {
        opacity: [0, 1],
        translateY: [60, 0],
        scale: [0.9, 1],
        duration: 1000
      }, 200)
      .add(subtitleRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800
      }, 500)
      .add(uploadSectionRef.current, {
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 800
      }, 800);

    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const photos = await getGalleryPhotos();
      setGallery(photos);
    } catch (error) {
      console.error("Error loading gallery:", error);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isUnder50MB = file.size <= 50 * 1024 * 1024;
      return (isImage || isVideo) && isUnder50MB;
    });

    setFiles(prev => [...prev, ...validFiles]);

    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, {
          url: e.target.result,
          type: file.type,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    // Simular progreso para mejor UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append("files", file));
      if (userName) formData.append("userName", userName);
      if (message) formData.append("message", message);

      await uploadPhotos(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setShowSuccess(true);
        setFiles([]);
        setPreviews([]);
        setUserName("");
        setMessage("");
        setUploadProgress(0);
      }, 300);

      setTimeout(() => {
        setShowSuccess(false);
        loadGallery();
      }, 3500);
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      console.error("Error uploading:", error);
      alert("Hubo un error al subir los archivos. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="galeria-page">
      {/* Hero Section */}
      <section ref={heroRef} className="galeria-hero">
        <div className="galeria-hero__inner">
          <h1 ref={titleRef} className="galeria-hero__title" style={{ opacity: 0 }}>
            Momentos Inolvidables
          </h1>
          <div className="galeria-hero__divider"></div>
          <p ref={subtitleRef} className="galeria-hero__subtitle" style={{ opacity: 0 }}>
            Comparte tus fotografías y videos de nuestra celebración
          </p>
        </div>
      </section>

      {/* Upload Section */}
      <section ref={uploadSectionRef} className="galeria-upload" style={{ opacity: 0 }}>
        <div className="galeria-upload__container">
          <h2 className="galeria-upload__heading">Sube tus fotos y videos</h2>

          {/* Drag & Drop Zone */}
          <div
            className={`drop-zone ${dragActive ? "drop-zone--active" : ""} ${previews.length > 0 ? "drop-zone--has-files" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />

            {previews.length === 0 ? (
              <div className="drop-zone__empty">
                <svg className="drop-zone__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="drop-zone__text">
                  Arrastra fotos y videos aquí
                </p>
                <p className="drop-zone__subtext">
                  o toca para seleccionar archivos
                </p>
                <p className="drop-zone__limit">Máximo 50MB por archivo</p>
              </div>
            ) : (
              <div className="preview-grid">
                {previews.map((preview, index) => (
                  <div key={index} className="preview-item">
                    <button
                      className="preview-item__remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      ×
                    </button>
                    {preview.type.startsWith("image/") ? (
                      <img src={preview.url} alt={preview.name} className="preview-item__image" />
                    ) : (
                      <video src={preview.url} className="preview-item__video" />
                    )}
                  </div>
                ))}
                <button className="preview-add-more" onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Optional Form */}
          {previews.length > 0 && (
            <div className="galeria-form">
              <input
                type="text"
                placeholder="Tu nombre (opcional)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="galeria-form__input"
                autoComplete="name"
                autoCapitalize="words"
                autoCorrect="on"
              />
              <textarea
                placeholder="Describe este momento (opcional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="galeria-form__textarea"
                rows={3}
                autoCapitalize="sentences"
                autoCorrect="on"
                spellCheck="true"
              />

              <button
                className="galeria-form__submit"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <span className="uploading-spinner">
                      <svg className="spinner" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="none" strokeWidth="3" />
                      </svg>
                      Subiendo {uploadProgress}%
                    </span>
                    <div className="upload-progress-bar">
                      <div
                        className="upload-progress-fill"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </>
                ) : (
                  `Subir ${files.length} ${files.length === 1 ? 'archivo' : 'archivos'}`
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Grid */}
      {gallery.length > 0 && (
        <section className="galeria-grid-section">
          <div className="galeria-grid-section__container">
            <h2 className="galeria-grid-section__heading">Momentos compartidos</h2>
            <div className="masonry-grid">
              {gallery.map((item, index) => (
                <div key={item.id || index} className="masonry-item">
                  {item.type === "image" ? (
                    <img src={item.url} alt={item.message || "Foto de la boda"} loading="lazy" />
                  ) : (
                    <video src={item.url} controls />
                  )}
                  {item.userName && (
                    <div className="masonry-item__info">
                      <p className="masonry-item__name">{item.userName}</p>
                      {item.message && <p className="masonry-item__message">{item.message}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="success-modal">
          <div className="success-modal__content">
            <div className="success-modal__icon">
              <svg viewBox="0 0 52 52" className="checkmark-svg">
                <circle cx="26" cy="26" r="25" fill="none" className="checkmark-circle"/>
                <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className="checkmark-check"/>
              </svg>
            </div>
            <h3 className="success-modal__title">Gracias por compartir</h3>
            <p className="success-modal__text">Tus recuerdos se han guardado exitosamente</p>
          </div>
        </div>
      )}
    </div>
  );
}
