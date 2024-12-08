const hl = (content: string) => `<span class='text-primary'>${content}</span>`;

export const menus: SidebarItem[] = [
    {
        name: "Subnetting",
        icon: "pi-sitemap",
        route: "/subnetting",
    },
    {
        name: "Error Detection",
        icon: "pi-qrcode",
        route: "/error-detection",
        tooltip: `Includes ${hl("LRC")}, ${hl("CRC")}, and ${hl(
            "Hamming Code"
        )}.`,
    },
];
