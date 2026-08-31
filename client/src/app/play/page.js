import Link from "next/link";

export default function Play() {
return (
    <div className={"page-container"}>
        <h1>Play</h1>

        <Link href={"/themes"} className={"theme-btn"}>
            Host
        </Link>
        <Link href={"/join"} className={"join-btn"}>
           Join
        </Link>
    </div>
    );
}