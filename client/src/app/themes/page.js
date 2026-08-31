import ThemeCard from "@/app/themes/_components/ThemeCard";

async function getThemes() {
    const response = await fetch('http://localhost:8080/api/theme')
}
export default function Themes() {
return (
        <div className={"page-container"}>
            <h1>Themes</h1>
            <ThemeCard />
        </div>
    )
}