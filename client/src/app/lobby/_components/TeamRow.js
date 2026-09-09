"use client"

export default function TeamRow({ team, index }) {
    return (
        <li className="flex items-center gap-3 list-row p-3 text-sm">
            <span className="font-bold text-muted-light">#{index + 1}</span>
            <span className="text-emphasis">{team.teamName}</span>
        </li>
    );
}