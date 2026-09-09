import ThemeCard from "@/app/themes/_components/ThemeCard";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getThemes() {
    const response = await fetch(`${API_URL}/theme`);

    if (!response.ok) throw new Error("Themes not found");
    return response.json();
}

export default async function Themes() {
    const themes = await getThemes();
    return (

        <div className={"page-container"}>
            <h1 className={"mt-2 text-3xl heading-brand sm:text-4xl"}>Themes</h1>
            <ul className={"p-2 space-y-4"}>
                {themes.map((theme) => (
                    <ThemeCard key={theme.themeId} theme={theme}></ThemeCard>
                ))}
            </ul>
        </div>
    )
}