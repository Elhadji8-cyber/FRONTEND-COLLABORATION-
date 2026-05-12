import Image from "next/image"; // Importez le composant Image de Next.js

interface MessageBubbleProps {
  id: string;
  senderName: string;
  avatarUrl?: string; // Ajout de la prop avatarUrl
  sentAt: string;
  content: string;
  fileId?: string | null;
  isOwn: boolean;
}

function Avatar({ avatarUrl, senderName }: { avatarUrl?: string; senderName: string }) {
  const src = typeof avatarUrl === "string" && avatarUrl ? avatarUrl : "/default-avatar.png";

  if (src.startsWith("data:image/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${senderName}'s avatar`}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={`${senderName}'s avatar`}
      width={32}
      height={32}
      className="rounded-full"
      style={{ width: 32, height: 32 }}
    />
  );
}

export function MessageBubble({
  senderName,
  avatarUrl,
  sentAt,
  content,
  fileId,
  isOwn,
}: MessageBubbleProps) {
  return (
    <div className={`flex items-start gap-3 ${isOwn ? "justify-end" : ""}`}>
      {!isOwn && (
        <div className="flex-shrink-0">
          {/* Affichage de l'avatar */}
          <Avatar avatarUrl={avatarUrl} senderName={senderName} />
        </div>
      )}
      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        <div className="text-xs text-gray-500">{senderName} - {sentAt}</div>
        <div className={`p-2 rounded-lg ${isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
          {content}
          {fileId && (
            <div className="mt-2">
              <span className="text-xs opacity-75">📎 Fichier attaché</span>
              {/* TODO: Ajouter un bouton pour télécharger le fichier */}
            </div>
          )}
        </div>
      </div>
      {isOwn && (
        <div className="flex-shrink-0">
          {/* Affichage de l'avatar pour les messages de l'utilisateur courant */}
          <Avatar avatarUrl={avatarUrl} senderName={senderName} />
        </div>
      )}
    </div>
  );
}
