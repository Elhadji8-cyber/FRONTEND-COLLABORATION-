"use client";

import { useState, type ChangeEvent } from "react";

type SubmitPywModalProps = {
    visible: boolean;
    onClose: () => void;
    onSubmit: (title: string, files: FileList) => Promise<void>;
    isSubmitting?: boolean;
    error?: string;
};

export function SubmitPywModal({
    visible,
    onClose,
    onSubmit,
    isSubmitting = false,
    error,
}: SubmitPywModalProps) {
    const [title, setTitle] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [localError, setLocalError] = useState("");

    if (!visible) return null;

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files ? Array.from(event.target.files) : [];
        setFiles(selected);
        setLocalError("");
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            setLocalError("Le titre du travail est requis.");
            return;
        }
        if (files.length === 0) {
            setLocalError("Veuillez sélectionner au moins un fichier.");
            return;
        }

        setLocalError("");
        const dataTransfer = new DataTransfer();
        files.forEach((file) => dataTransfer.items.add(file));

        try {
            await onSubmit(title.trim(), dataTransfer.files);
        } catch {
            // error handled by parent
        }
    };

    const handleClose = () => {
        setTitle("");
        setFiles([]);
        setLocalError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-[2rem] bg-surface-container-low p-6 shadow-2xl">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-on-surface">Soumettre un nouveau travail</h2>
                        <p className="mt-2 text-sm text-on-surface-variant">
                            Remplissez le titre et sélectionnez les fichiers à uploader.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface transition hover:bg-surface-container-high"
                        aria-label="Fermer"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-on-surface mb-2">Titre du travail</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex : Plan de fondations"
                            className="w-full rounded-2xl border border-outline-variant/50 bg-white px-4 py-3 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-on-surface mb-2">Fichiers</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="block w-full text-sm text-on-surface"
                        />
                        <p className="mt-2 text-xs text-on-surface-variant">
                            Formats supportés : DWG, RVT, PLN, ARCHICAD, PDF, DOCX, XLSX, images et plus.
                        </p>
                        {files.length > 0 && (
                            <div className="mt-3 space-y-2 rounded-2xl border border-outline-variant/50 bg-surface-container-high p-4 text-sm text-on-surface-variant">
                                {files.map((file, index) => (
                                    <div key={`${file.name}-${index}`} className="truncate">
                                        {file.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {(localError || error) && (
                        <div className="rounded-2xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
                            {localError || error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-2xl border border-outline-variant/50 px-4 py-2.5 text-sm font-semibold text-on-surface transition hover:bg-surface-container"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                        >
                            {isSubmitting ? "Chargement..." : "Soumettre"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
