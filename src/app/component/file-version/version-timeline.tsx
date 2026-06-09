"use client";

import React, { useState } from "react";
import { FileVersion } from "@/types/pyw";
import { FileVersionService, formatVersionDate, formatFileSize } from "@/services/file-version.service";
import { FiDownload, FiEye, FiRotateCcw } from "react-icons/fi";
import { BsFileEarmarkPdf, BsFileEarmarkWord, BsFileEarmarkImage } from "react-icons/bs";
import "./version-timeline.css";

interface VersionTimelineProps {
  versions: FileVersion[];
  currentVersionId?: string;
  onVersionSelect: (version: FileVersion) => void;
  onDownload: (version: FileVersion) => void;
  onRestore?: (version: FileVersion) => void;
  canRestore?: boolean;
}

/**
 * Composant pour afficher une timeline des versions de fichiers
 * Affiche v1 → v2 → v3 avec navigation et actions
 */
export function VersionTimeline({
  versions,
  currentVersionId,
  onVersionSelect,
  onDownload,
  onRestore,
  canRestore = false,
}: VersionTimelineProps) {
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);

  const getFileIcon = (fileType: string) => {
    const type = fileType?.toLowerCase() || "";
    if (type.includes("pdf")) return <BsFileEarmarkPdf className="w-5 h-5 text-red-500" />;
    if (type.includes("word") || type.includes("docx")) return <BsFileEarmarkWord className="w-5 h-5 text-blue-500" />;
    if (type.includes("image") || ["jpg", "png", "gif", "svg"].some(t => type.includes(t)))
      return <BsFileEarmarkImage className="w-5 h-5 text-green-500" />;
    return <BsFileEarmarkPdf className="w-5 h-5 text-gray-500" />;
  };

  const handleRestore = async (version: FileVersion) => {
    if (!onRestore) return;
    setRestoring(version.id);
    try {
      await onRestore(version);
    } finally {
      setRestoring(null);
    }
  };

  const isLatestVersion = versions.length > 0 && versions[0].id === currentVersionId;

  if (versions.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        <p>Aucune version disponible</p>
      </div>
    );
  }

  return (
    <div className="version-timeline">
      <div className="timeline-container">
        {versions.map((version, index) => {
          const isExpanded = expandedVersionId === version.id;
          const isCurrent = version.id === currentVersionId;
          const isLatest = index === 0;

          return (
            <div
              key={version.id}
              className={`timeline-item ${isLatest ? "latest" : ""} ${isCurrent ? "current" : ""}`}
            >
              {/* Timeline connector */}
              {index < versions.length - 1 && <div className="timeline-connector" />}

              {/* Timeline dot with pulse for latest */}
              <div className={`timeline-dot ${isLatest ? "pulse" : ""}`}>
                <span className="dot-inner" />
              </div>

              {/* Version card */}
              <div className={`version-card ${isExpanded ? "expanded" : ""}`}>
                {/* Header - always visible */}
                <div
                  className="version-header"
                  onClick={() => setExpandedVersionId(isExpanded ? null : version.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setExpandedVersionId(isExpanded ? null : version.id);
                    }
                  }}
                >
                  <div className="version-header-left">
                    <div className="version-badge">
                      {version.versionName}
                      {isLatest && <span className="latest-tag">Actuelle</span>}
                    </div>
                    <div className="version-meta">
                      <time className="version-date">{formatVersionDate(version.createdAt)}</time>
                      {version.changeNote && <p className="version-message">{version.changeNote}</p>}
                    </div>
                  </div>
                  <div className="version-size">
                    <span>{formatFileSize(version.fileSize)}</span>
                    <span className="chevron">{isExpanded ? "▼" : "▶"}</span>
                  </div>
                </div>

                {/* Content - expanded view */}
                {isExpanded && (
                  <div className="version-content">
                    {/* Details */}
                    <div className="version-details">
                      <div className="detail-row">
                        <span className="detail-label">Type:</span>
                        <div className="detail-value">
                          {getFileIcon(version.fileType)}
                          <span>{version.fileType.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Taille:</span>
                        <span className="detail-value">{formatFileSize(version.fileSize)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Créée le:</span>
                        <span className="detail-value">{formatVersionDate(version.createdAt)}</span>
                      </div>
                      {version.changeNote && (
                        <div className="detail-row full">
                          <span className="detail-label">Notes:</span>
                          <p className="detail-value note">{version.changeNote}</p>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="version-actions">
                      <button
                        className="action-btn details-btn"
                        onClick={() => onVersionSelect(version)}
                        title="Voir les détails"
                      >
                        <FiEye className="w-4 h-4" />
                        <span>Détails</span>
                      </button>

                      {FileVersionService.canDownload(version) && (
                        <button
                          className="action-btn download-btn"
                          onClick={() => onDownload(version)}
                          title="Télécharger cette version"
                        >
                          <FiDownload className="w-4 h-4" />
                          <span>Télécharger</span>
                        </button>
                      )}

                      {canRestore && !isLatest && onRestore && (
                        <button
                          className="action-btn restore-btn"
                          onClick={() => handleRestore(version)}
                          disabled={restoring === version.id}
                          title="Restaurer cette version"
                        >
                          <FiRotateCcw className="w-4 h-4" />
                          <span>{restoring === version.id ? "Restauration..." : "Restaurer"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="timeline-legend">
        <div className="legend-item">
          <div className="legend-dot pulse" />
          <span>Version actuelle</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" />
          <span>Versions antérieures</span>
        </div>
      </div>
    </div>
  );
}
