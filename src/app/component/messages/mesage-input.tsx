"use client";

import { FiPlus } from "react-icons/fi";
import { useRef, useState } from "react";

type MessageInputProps = {
    placeholder?: string;
    isLoading?: boolean;
    onSend?: (payload: {
        content: string;
        fileId?: string | null;
    }) => void;
};

export function MessageInput({
    placeholder = "Écrire un message...",
    isLoading = false,
    onSend,
}: MessageInputProps) {
    const [content, setContent] = useState("");
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [error, setError] = useState("");

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Auto resize textarea comme WhatsApp
    function handleTextareaChange(
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) {
        const textarea = e.target;

        setContent(textarea.value);

        // reset la hauteur
        textarea.style.height = "auto";

        // applique la nouvelle hauteur
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    // Enter = send
    // Shift + Enter = nouvelle ligne
    function handleKeyDown(
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            handleSubmit(
                e as unknown as React.FormEvent<HTMLFormElement>
            );
        }
    }

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        const trimmed = content.trim();

        // refuse message vide
        if (!trimmed && !attachedFile) {
            setError(
                "Le message doit contenir un texte ou un fichier."
            );
            return;
        }

        setError("");

        try {
            await onSend?.({
                content: trimmed,
                fileId: attachedFile
                    ? URL.createObjectURL(attachedFile)
                    : null,
            });

            // reset content
            setContent("");
            setAttachedFile(null);

            // reset hauteur textarea
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Impossible d'envoyer le message."
            );
        }
    }

    function handleFileChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0] || null;

        setAttachedFile(file);
    }

    return (
        <footer className="bg-surface p-3">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2"
            >
                {/* Preview fichier */}
                {attachedFile ? (
                    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container p-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-variant text-lg">
                                📄
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                    {attachedFile.name}
                                </p>

                                <p className="text-xs text-on-surface-variant">
                                    {(
                                        attachedFile.size /
                                        1024 /
                                        1024
                                    ).toFixed(2)}{" "}
                                    MB
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setAttachedFile(null)
                                }
                                className="rounded-full p-2 hover:bg-surface-container-high"
                            >
                                <span className="material-symbols-outlined text-sm">
                                    close
                                </span>
                            </button>
                        </div>
                    </div>
                ) : null}

                {/* Input style WhatsApp */}
                <div
                    className="
                        flex
                        items-end
                        gap-3
                        rounded-3xl
                        border
                        border-outline-variant/20
                        bg-surface-container
                        px-4
                        py-3
                    "
                >
                    {/* Upload fichier */}
                    <label className="cursor-pointer text-on-surface-variant transition hover:text-primary">
                        <FiPlus size={22} />

                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>

                    {/* Textarea auto grow */}
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={content}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="
                            max-h-40
                            flex-1
                            resize-none
                            overflow-y-auto
                            bg-transparent
                            py-2
                            text-sm
                            outline-none
                        "
                    />

                    {/* Send button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-primary
                            text-white
                            transition
                            hover:scale-105
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        <span className="material-symbols-outlined">
                            {isLoading
                                ? "hourglass_top"
                                : "send"}
                        </span>
                    </button>
                </div>

                {/* Error */}
                {error ? (
                    <div className="rounded-xl bg-error-container px-4 py-3 text-sm text-error">
                        {error}
                    </div>
                ) : null}
            </form>
        </footer>
    );
}