import CrossWord from "../ui/CrossWord"

export default function CrosswordSection() {
    return(
        <section className="flex flex-col items-center max-w-3xl">
            <h1>Gay Crossword</h1>
            <p>Click on the clues to cross them out. GoodLuck. Enjoy.</p>
            <CrossWord />
        </section>
    )
}
