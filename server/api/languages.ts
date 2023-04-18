import english from "@/public/languages/english.json"

export default defineEventHandler(async(e)=>{
        const query = getQuery(e)

	const numWords: number = parseInt(query.num as string) || 10;
	const selected_char = (query.char as string) || "";
	const difficulty: "easy" | "medium" | "hard" | "extra_hard" =
		(query.difficulty as
			| "easy"
			| "medium"
			| "hard"
			| "extra_hard") || "easy";

        const returnArray = []
        let i = 0;
        while (i < numWords){
                returnArray.push(english.words[Math.round(Math.random()*200)])
                i++;
        }
        return returnArray
})