import CrossWord from "../ui/CrossWord"

export default function CrosswordSection() {
    return(
        <section className="flex flex-col items-center w-full px-4 max-w-3xl mx-auto">
            <p>Click on the clues to cross them out. GoodLuck. Enjoy.</p>
            <CrossWord />
        </section>
    )
}
