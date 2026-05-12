import { VersionTimeline } from "../../../component/files/version-timeline";

<VersionTimeline
    versions={[
        {
            id: "v4",
            versionLabel: "V4",
            title: "Updated electrical specs",
            author: "Sarah M.",
            createdAtLabel: "2 hours ago",
            note: "Updated the load distribution for the main transformer grid.",
            isActive: true,
        },
        {
            id: "v3",
            versionLabel: "V3",
            title: "Initial structural draft",
            author: "John D.",
            createdAtLabel: "Yesterday at 4:12 PM",
            note: "Foundation requirements finalized for the south-east perimeter blocks.",
        },
    ]}
/>
