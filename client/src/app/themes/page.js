import ThemeCard from "@/app/themes/_components/ThemeCard";

async function getThemes() {
    const response = await fetch('http://localhost:8080/api/theme');

    if (!response.ok) throw new Error("Themes not found");
    return response.json();
}

export default async function Themes() {
    const themes = await getThemes();
    return (

        <div className={"page-container"}>
            <h1>Themes</h1>
            <ul>
                {themes.map((theme) => (
                    <ThemeCard key={theme.themeId} theme={theme}></ThemeCard>
                ))}
            </ul>
        </div>
    )
}