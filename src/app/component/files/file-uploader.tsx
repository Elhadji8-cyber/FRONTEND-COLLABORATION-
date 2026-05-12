"use client";

import { useRef, useState } from "react";

type FileUploaderProps = {
    title?: string;
    description?: string;
    submitLabel?: string;
    showVersionNote?: boolean;
    isLoading?: boolean;
    onSubmit?: (payload: {
        file: File;
        versionNote?: string;
    }) => Promise<void> | void;
};

export function FileUploader({
    title = "Upload Document",
    description = "Select a file to upload into the workspace.",
    submitLabel = "Upload File",
    showVersionNote = false,
    isLoading = false,
    onSubmit,
}: FileUploaderProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [versionNote, setVersionNote] = useState("");
    const [error, setError] = useState("");

    function handlePickFile() {
        inputRef.current?.click();
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        setError("");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!selectedFile) {
            setError("Please select a file before uploading.");
            return;
        }

        try {
            await onSubmit?.({
                file: selectedFile,
                versionNote: showVersionNote ? versionNote.trim() : undefined,
            });

            // Reset local state after successful upload
            setSelectedFile(null);
            setVersionNote("");
            setError("");

            if (inputRef.current) {
                inputRef.current.value = "";
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed.");
        }
    }

    return (
        <section className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-bold tracking-tight text-on-surface">{title}</h3>
                <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                />

                <button
                    type="button"
                    onClick={handlePickFile}
                    className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-low px-6 py-10 text-center transition hover:bg-surface-container"
                >
                    <span className="material-symbols-outlined mb-3 text-3xl text-primary">
                        upload_file
                    </span>
                    <p className="text-sm font-semibold text-on-surface">
                        Click to choose a file
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                        PDF, DWG, BIM, XLSX, images, and more
                    </p>
                </button>

                {selectedFile ? (
                    <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-variant text-primary">
                                <span className="material-symbols-outlined">description</span>
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-on-surface">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-on-surface-variant">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}

                {showVersionNote ? (
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                            Version Note
                        </label>
                        <textarea
                            rows={4}
                            value={versionNote}
                            onChange={(e) => setVersionNote(e.target.value)}
                            placeholder="Describe what changed in this version..."
                            className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
                        />
                    </div>
                ) : null}

                {error ? (
                    <div className="rounded-lg bg-error-container px-4 py-3 text-sm font-medium text-error">
                        {error}
                    </div>
                ) : null}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined text-lg">
                            {isLoading ? "hourglass_top" : "cloud_upload"}
                        </span>
                        {isLoading ? "Uploading..." : submitLabel}
                    </button>
                </div>
            </form>

            {/*
        TODO: brancher ici ton backend Go depuis le parent.

        Cas 1: Upload nouveau fichier
        Backend Go :
        POST /api/v1/files/upload

        Cas 2: Upload nouvelle version
        Backend Go :
        POST /api/v1/files/:id/version

        Important :
        comme ton backend Go attend du multipart/form-data pour les fichiers,
        le parent devra construire un FormData.

        Exemple dans la page parent :
        const formData = new FormData();
        formData.append("file", payload.file);
        formData.append("project_id", projectId);
        formData.append("company_id", companyId);
        formData.append("uploaded_by", userId);

        Si c'est une version :
        formData.append("change_note", payload.versionNote || "");

        Puis fetch vers ton backend Go.
      */}
        </section>
    );
}
