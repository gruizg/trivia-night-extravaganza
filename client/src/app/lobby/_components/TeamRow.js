"use client"

export default function TeamRow({ team, index }) {
    return (
        <li className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-800">
            <span className="font-bold text-gray-400">#{index + 1}</span>
            <span className="font-medium text-gray-900 dark:text-white">{team.teamName}</span>
        </li>
    );
}