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

    const { getRootProps, getInputProps } = useDropzone({ onDrop });


    const projectData = new Map()

    if (csvData != null) {

        csvData.map((el: Array<string>) => {
            const projectIdKey = el[1]
            const employeeIdValue = el[0]

            if (projectData.has(projectIdKey)) {
                projectData.set(projectIdKey, [...projectData.get(projectIdKey), employeeIdValue])
            } else {
                projectData.set(el[1], [el[0]])
            }
        })
    }

    projectData.forEach((value, key) => {
        if (value.length == 2) {
            console.log('we got em', value)
        }
    })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} type="file" accept=".csv" />
            <p>Click here to upload CSV files...</p>
            <ResultsTable csvData={csvData} />
        </div>
    )
}