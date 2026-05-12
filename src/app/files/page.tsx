"use client"
import { AppShell } from "../component/layout/app-shell";
import { FilesTable, type FileRow } from "../component/files/files.table";

const mockFiles: FileRow[] = [
    {
        id: "file-1",
        name: "Structural_Beam_Specifications_V2.pdf",
        type: "PDF",
        sizeLabel: "4.2 MB",
        uploadedBy: "Marcus Thorne",
        uploadedAt: "Oct 12, 2024",
        icon: "description",
        highlighted: true,
    },
    {
        id: "file-2",
        name: "Foundation_Layout_CAD.dwg",
        type: "CAD",
        sizeLabel: "12.8 MB",
        uploadedBy: "Sarah Jenkins",
        uploadedAt: "Oct 11, 2024",
        icon: "architecture",
    },
    {
        id: "file-3",
        name: "Load_Calculation_Spreadsheet.xlsx",
        type: "Excel",
        sizeLabel: "2.1 MB",
        uploadedBy: "David Chen",
        uploadedAt: "Oct 10, 2024",
        icon: "table",
    },
    {
        id: "file-4",
        name: "Site_Photos_Inspection.zip",
        type: "Archive",
        sizeLabel: "45.6 MB",
        uploadedBy: "Alex Peterson",
        uploadedAt: "Oct 9, 2024",
        icon: "folder_zip",
    },
    {
        id: "file-5",
        name: "Safety_Protocol_Document.pdf",
        type: "PDF",
        sizeLabel: "1.8 MB",
        uploadedBy: "Marcus Thorne",
        uploadedAt: "Oct 8, 2024",
        icon: "description",
    },
];

export default function FilesPage() {
    const handleUploadClick = () => {
        // TODO: ouvrir un modal d'upload ou rediriger vers upload page
        console.log("Upload clicked");
    };

    const handleFilterClick = () => {
        // TODO: ouvrir un modal de filtres
        console.log("Filter clicked");
    };

    return (
        <AppShell active="files">
            <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-8">
                <FilesTable
                    files={mockFiles}
                    title="Project Documents"
                    onUploadClick={handleUploadClick}
                    onFilterClick={handleFilterClick}
                />
            </div>
        </AppShell>
    );
}
