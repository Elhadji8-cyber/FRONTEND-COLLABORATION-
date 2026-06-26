"use client";

import { FiFile, FiImage, FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import type { UploadProgressItem } from "@/services/file.service";

interface UploadProgressListProps {
  items: UploadProgressItem[];
}

function getStatusLabel(status: UploadProgressItem["status"]) {
  switch (status) {
    case "uploading":
      return "Téléversement";
    case "completed":
      return "Terminé";
    case "error":
      return "Échec";
    default:
      return "En attente";
  }
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }
  return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function UploadProgressList({ items }: UploadProgressListProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-4 space-y-3 rounded-xl border border-outline-variant/40 bg-surface-container-high p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-on-surface">État des transferts</h4>
        <span className="text-xs text-on-surface-variant">Prévisualisation et progression</span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-outline-variant/30 bg-surface p-3">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-container text-primary">
                {item.fileType?.startsWith("image/") ? (
                  <FiImage className="h-5 w-5" />
                ) : (
                  <FiFile className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-on-surface">{item.fileName}</p>
                  <span className="text-xs text-on-surface-variant">{formatBytes(item.fileSize)}</span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-on-surface-variant">
                  {item.status === "uploading" && <FiLoader className="h-3.5 w-3.5 animate-spin" />}
                  {item.status === "completed" && <FiCheckCircle className="h-3.5 w-3.5 text-green-600" />}
                  {item.status === "error" && <FiAlertCircle className="h-3.5 w-3.5 text-red-600" />}
                  <span>{getStatusLabel(item.status)}</span>
                  {typeof item.progress === "number" && <span>• {item.progress}%</span>}
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-outline-variant/30">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.status === "error" ? "bg-red-500" : item.status === "completed" ? "bg-green-500" : "bg-primary"
                    }`}
                    style={{ width: `${Math.max(4, item.progress)}%` }}
                  />
                </div>

                {item.error && <p className="mt-2 text-xs text-red-600">{item.error}</p>}

                {item.previewUrl && (item.fileType?.startsWith("image/") || item.fileType?.includes("pdf")) && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-outline-variant/30">
                    {item.fileType?.startsWith("image/") ? (
                      <img src={item.previewUrl} alt={item.fileName} className="max-h-40 w-full object-contain" />
                    ) : (
                      <iframe src={item.previewUrl} title={item.fileName} className="h-40 w-full" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
