import Papa from "papaparse";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ResultsTable from "./ResultsTable";



export default function Dropzone() {

    const [csvData, setCsvData] = useState<Array<string[]> | null>(null)

    const [parsedCsvData, setParsedCsvData] = useState([])

    const parseFile = file => {
        Papa.parse(file, {
            complete: results => {
                const resData = results.data as unknown as Array<string[]>
                setCsvData(resData)

            }
        })
    }

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length) {
            parseFile(acceptedFiles[0])
        }
    }, [])

    const {
        getRootProps,
        getInputProps,
    } = useDropzone({
        onDrop
    });

    const dateOrganizer = (csvData) => {
        //create MAP out of csvData , dayJS?
     


    }
    dateOrganizer(csvData)

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} type="file" accept=".csv" />
            <p>Click here to upload CSV files...</p>
            <ResultsTable csvData={csvData} />
        </div>
    )
}