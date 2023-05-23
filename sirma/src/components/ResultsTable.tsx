interface TableDataProps {
    csvData: Array<string[]> | null
}

export default function ResultsTable({ csvData }: TableDataProps) {
    
    return (
        <div className="bg-zinc-800">
            <table className="text-cyan-100">
                <thead>
                    <tr>
                        <th>Employee ID #1</th>
                        <th>Employee ID #2</th>
                        <th>Project ID</th>
                        <th>Days worked</th>
                    </tr>
                </thead>
                <tbody>
                    {csvData && csvData.map((d, i) => {
                        return <tr key={i}>
                            <td>{d[0]}</td>
                            <td>{d[1]}</td>
                            <td>{d[2]}</td>
                            <td>{d[3]}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}