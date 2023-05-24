interface TableDataProps {
    parsedData: any[] | null
}

export default function ResultsTable({ parsedData }: TableDataProps) {

    return (
        <div className="bg-zinc-800 p-2 w-fit">
            <table className="text-cyan-100">
                <thead>
                    <tr>
                        <th className="p-2">Employee ID #1</th>
                        <th className="p-2">Employee ID #2</th>
                        <th className="p-2">Project ID</th>
                        <th className="p-2">Days worked</th>
                    </tr>
                </thead>
                <tbody>
                    {parsedData && parsedData.map((d, i) => {
                        return <tr key={i}>
                            <td>{d.emp1}</td>
                            <td>{d.emp2}</td>
                            <td>{d.pId}</td>
                            <td>{d.days}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}