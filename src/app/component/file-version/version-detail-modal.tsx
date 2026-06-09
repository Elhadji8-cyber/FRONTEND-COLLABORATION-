"use client";

import React, { useState, useEffect } from "react";
import { FileVersion } from "@/types/pyw";
import {
  FileVersionService,
  formatVersionDate,
  formatFileSize,
  compareVersions,
} from "@/services/file-version.service";
import { FiX, FiDownload, FiRotateCcw, FiArrowRight } from "react-icons/fi";
import { BsFileEarmarkPdf, BsFileEarmarkWord, BsFileEarmarkImage } from "react-icons/bs";
import "./version-detail-modal.css";

interface VersionDetailModalProps {
  version: FileVersion;
  allVersions?: FileVersion[];
  isOpen: boolean;
  onClose: () => void;
  onDownload: (version: FileVersion) => void;
  onRestore?: (version: FileVersion) => void;
  canRestore?: boolean;
}

/**
 * Modal de détails d'une version avec comparaison
 */
export function VersionDetailModal({
  version,
  allVersions = [],
  isOpen,
  onClose,
  onDownload,
  onRestore,
  canRestore = false,
}: VersionDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [comparison, setComparison] = useState<ReturnType<typeof compareVersions> | null>(null);

  useEffect(() => {
    if (isOpen && allVersions.length > 0) {
      const currentIndex = allVersions.findIndex((v) => v.id === version.id);
      if (currentIndex > 0) {
        const previousVersion = allVersions[currentIndex + 1];
        const comp = compareVersions(previousVersion, version);
        setComparison(comp);
      }
    }
  }, [isOpen, version, allVersions]);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      await onDownload(version);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!onRestore) return;
    setIsRestoring(true);
    try {
      await onRestore(version);
      onClose();
    } finally {
      setIsRestoring(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType?.toLowerCase() || "";
    if (type.includes("pdf")) return <BsFileEarmarkPdf className="w-6 h-6 text-red-500" />;
    if (type.includes("word") || type.includes("docx")) return <BsFileEarmarkWord className="w-6 h-6 text-blue-500" />;
    if (type.includes("image") || ["jpg", "png", "gif", "svg"].some(t => type.includes(t)))
      return <BsFileEarmarkImage className="w-6 h-6 text-green-500" />;
    return <BsFileEarmarkPdf className="w-6 h-6 text-gray-500" />;
  };

  if (!isOpen) return null;

  const currentIndex = allVersions.findIndex((v) => v.id === version.id);
  const isLatest = currentIndex === 0;
  const previousVersion = currentIndex > 0 ? allVersions[currentIndex + 1] : null;
  const fileType = (version.fileType || "").toUpperCase();
  const storageKey = version.storageKey || "";
  const uploadedBy = version.uploadedBy || "Inconnu";

  return (
    <div className="version-detail-modal-overlay" role="presentation" onClick={onClose}>
      <div className="version-detail-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="version-title">
              <span className="version-label">{version.versionName}</span>
              {isLatest && <span className="badge-latest">Version actuelle</span>}
            </div>
            <p className="version-subtitle">Détails et historique des modifications</p>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            title="Fermer"
            aria-label="Fermer le modal"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Main info */}
          <div className="info-section">
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Type de fichier</label>
                <div className="info-value">
                  {getFileIcon(fileType)}
                  <span>{fileType || "FICHIER"}</span>
                </div>
              </div>

              <div className="info-item">
                <label className="info-label">Taille</label>
                <div className="info-value">
                  <span className="file-size">{formatFileSize(version.fileSize ?? 0)}</span>
                </div>
              </div>

              <div className="info-item">
                <label className="info-label">Date de création</label>
                <div className="info-value">
                  <span>{formatVersionDate(version.createdAt)}</span>
                </div>
              </div>

              <div className="info-item">
                <label className="info-label">Dernière modification</label>
                <div className="info-value">
                  <span>{formatVersionDate(version.updatedAt)}</span>
                </div>
              </div>
            </div>

            {version.changeNote && (
              <div className="note-section">
                <label className="info-label">Notes de changement</label>
                <div className="note-box">
                  <p>{version.changeNote}</p>
                </div>
              </div>
            )}
          </div>

          {/* Comparison with previous version */}
          {previousVersion && comparison && (
            <div className="comparison-section">
              <h3 className="comparison-title">Comparaison avec version précédente</h3>
              <div className="comparison-container">
                <div className="comparison-version">
                  <div className="comparison-header">
                    <span className="comparison-label">{previousVersion.versionName}</span>
                    <span className="comparison-size">{formatFileSize(previousVersion.fileSize ?? 0)}</span>
                  </div>
                  <p className="comparison-date">{formatVersionDate(previousVersion.createdAt)}</p>
                </div>

                <div className="comparison-arrow">
                  <FiArrowRight className="w-5 h-5" />
                </div>

                <div className="comparison-version current">
                  <div className="comparison-header">
                    <span className="comparison-label">{version.versionName}</span>
                    <span className="comparison-size">{formatFileSize(version.fileSize ?? 0)}</span>
                  </div>
                  <p className="comparison-date">{formatVersionDate(version.createdAt)}</p>
                </div>
              </div>

              {comparison.changes.length > 0 && (
                <div className="changes-list">
                  <p className="changes-title">Changements détectés:</p>
                  <ul>
                    {comparison.changes.map((change, idx) => (
                      <li key={idx} className={comparison.sizeDiff > 0 ? "increased" : "decreased"}>
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="metadata-section">
            <h3 className="metadata-title">Métadonnées</h3>
            <div className="metadata-table">
              <div className="metadata-row">
                <span className="metadata-key">ID Version:</span>
                <span className="metadata-value mono">{version.id.substring(0, 12)}...</span>
              </div>
              <div className="metadata-row">
                <span className="metadata-key">Clé de stockage:</span>
                <span className="metadata-value mono">{storageKey.substring(0, 30)}...</span>
              </div>
              <div className="metadata-row">
                <span className="metadata-key">Uploadée par:</span>
                <span className="metadata-value mono">{uploadedBy}</span>
              </div>
              <div className="metadata-row">
                <span className="metadata-key">Numéro:</span>
                <span className="metadata-value">{version.versionNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with actions */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Fermer
          </button>

          {FileVersionService.canDownload(version) && (
            <button
              className="btn btn-primary"
              onClick={handleDownload}
              disabled={isLoading}
              title="Télécharger cette version"
            >
              <FiDownload className="w-5 h-5" />
              <span>{isLoading ? "Téléchargement..." : "Télécharger"}</span>
            </button>
          )}

          {canRestore && !isLatest && onRestore && (
            <button
              className="btn btn-warning"
              onClick={handleRestore}
              disabled={isRestoring}
              title="Restaurer cette version comme version actuelle"
            >
              <FiRotateCcw className="w-5 h-5" />
              <span>{isRestoring ? "Restauration..." : "Restaurer cette version"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
