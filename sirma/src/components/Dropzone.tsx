import Papa from "papaparse";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ResultsTable from "./ResultsTable";
import * as dayjs from 'dayjs'


type CsvFileDataType = Array<string[]>
type ParsedCsvFileDataType = Array<Record<string, any>>

export default function Dropzone() {

    const [parsedCsvData, setParsedCsvData] = useState<ParsedCsvFileDataType>([])

    const parseFile = (file: any) => {
        Papa.parse(file, {
            complete: results => {
                const resData = results.data as unknown as CsvFileDataType
                const projectDataMapByProjectId = createProjectDataMapByProjectId(resData)
                datePairings(projectDataMapByProjectId, resData)
            }
        })
    }

    const onDrop = useCallback((acceptedFiles: string | any[]) => {
        if (acceptedFiles.length) {
            parseFile(acceptedFiles[0])
        }
    }, [])

    const { getRootProps, getInputProps } = useDropzone({ onDrop, noDragEventsBubbling: true })

    const createProjectDataMapByProjectId = (resData: CsvFileDataType) => {
        const projectData = new Map()

        if (resData) {
            resData.forEach((el: Array<string>) => {

                const projectIdKey = el[1]

                if (projectData.has(projectIdKey)) {
                    projectData.set(projectIdKey, [projectData.get(projectIdKey), el])
                } else {
                    projectData.set(projectIdKey, el)
                }
            })
        }
        return projectData
    }

    const datePairings = (projectData: Map<number, string[]>, resData: CsvFileDataType | null) => {
        const gatheredData: ParsedCsvFileDataType = []
        projectData.forEach((value, key) => {
            if (value.length == 2 && resData != null) {
                const [employee1, employee2] = [...value]
                const firstEmployeeArrayEndDate = employee1[3]
                const secondEmployeeArrayEndDate = employee2[3]

                let startDateEmployeesPairing
                let endDateEmployeesPairing

                const firstEmployeeStartDate = dayjs(employee1[2])
                const secondEmployeeStartDate = dayjs(employee2[2])
                if (firstEmployeeStartDate.diff(secondEmployeeStartDate, 'day') > 0) {
                    startDateEmployeesPairing = firstEmployeeStartDate
                } else {
                    startDateEmployeesPairing = secondEmployeeStartDate
                }

                let firstEmployeeEndDate
                if (firstEmployeeArrayEndDate === 'NULL') {
                    firstEmployeeEndDate = dayjs()
                } else {
                    firstEmployeeEndDate = dayjs(firstEmployeeArrayEndDate)
                }

                let secondEmployeeEndDate
                if (secondEmployeeArrayEndDate === 'NULL') {
                    secondEmployeeEndDate = dayjs()
                } else {
                    secondEmployeeEndDate = dayjs(secondEmployeeArrayEndDate)
                }

                if (firstEmployeeEndDate.diff(secondEmployeeEndDate, 'day') < 0) {
                    endDateEmployeesPairing = firstEmployeeEndDate
                } else {
                    endDateEmployeesPairing = secondEmployeeEndDate
                }

                const daysWorkedTogether = endDateEmployeesPairing.diff(startDateEmployeesPairing, 'day')

                gatheredData.push({ emp1: employee1, emp2: employee2, pId: key, days: daysWorkedTogether })
            }
        })

        gatheredData.sort((project1, project2) => {
            const project1Days = project1.days
            const project2Days = project2.days
            return project2Days - project1Days
        })

        setParsedCsvData(gatheredData)
    }


    return (
        <div {...getRootProps()} className="p-2 cursor-pointer">
            <input {...getInputProps()} accept=".csv" className="p-2" />
            <p className="p-2">Drop files here to upload CSV files...</p>
            <ResultsTable parsedData={parsedCsvData} />
        </div>
    )
}