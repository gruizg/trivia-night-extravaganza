export default function ThemeCard({ theme }) {
return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div>
            {/* Title and Author Header */}
            <div className="mb-3">
                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {/*{theme.themeTitle}*/}
                </h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {/*by {author}*/}
                </p>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {/*{description}*/}
            </p>
        </div>
    </div>
    )
}
// {
//     "themeId": 1,
//     "themeTitle": "General Knowledge & Trivia Night",
//     "themeDescription": "A standard 6-round trivia game with halftime and final questions.",
//     "user": {
//     "userId": 1,
//         "username": "user",
//         "email": "email",
//         "password": "hashed-password"
// }
// }