# Monolith Landing

Version decoupee en composants React pour Next.js, stylisee avec Tailwind, en conservant la palette de couleurs du HTML d'origine.

## Structure

- `MonolithLanding.tsx`: composant principal a importer dans ton application
- `components/*`: sections separees de la landing page
- `page.tsx`: exemple de page Next.js App Router

## Integration dans Next.js

1. Copie le dossier `frontend/monolith-landing` dans ton projet, par exemple dans `src/components/landing/monolith`.
2. Assure-toi que Tailwind est deja configure dans ton projet Next.js.
3. Importe le composant principal depuis une page ou un layout:

```tsx
import MonolithLanding from "@/components/landing/monolith/MonolithLanding";

export default function HomePage() {
  return <MonolithLanding />;
}
```

## Notes

- Le design est responsive: mobile, tablette et desktop.
- Les couleurs d'origine sont conservees via des variables CSS locales au composant.
- Les icones Material Symbols ont ete remplacees par des SVG React pour eviter une dependance externe.
- Si tu utilises `next/image`, tu peux remplacer les balises `img` plus tard avec ta configuration `images.remotePatterns`.