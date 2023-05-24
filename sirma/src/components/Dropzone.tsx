import Papa from "papaparse";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ResultsTable from "./ResultsTable";
import * as dayjs from 'dayjs'


export default function Dropzone() {

    const [csvData, setCsvData] = useState<Array<string[]> | null>(null)

    const parsedCsvData = []

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
        if (value.length == 2 && csvData != null) {
            const [employee1, employee2] = [...value]
            const dates = []
            let date1
            let date2
            csvData.map((el) => {
                if (el.includes(employee1) || el.includes(employee2)) {
                    dates.push(el[2], el[3])
                }
            })

            const startDate1 = dayjs(dates[0])
            console.log(dates, dates[1])
            const startDate2 = dayjs(dates[2])
            let endDate1
            let endDate2

            if (startDate1.diff(startDate2, 'day') > 0) {
                date1 = startDate1
            } else {
                date1 = startDate2
            }

            if (dates[1] == 'NULL') {
                date2 = dates[3]
            } else {
                endDate1 = dayjs(dates[1])
            }

            if (dates[3] == 'NULL') {
                date2 = dates[1]
            } else {
                endDate2 = dayjs(dates[3])
            }

            // if (dates[1] == 'NULL' && dates[3] == 'NULL') {
            //     endDate1 = new Date()
            //     endDate2 = new Date()
            // }

            if (endDate1 != undefined && endDate2 != undefined) {
                endDate1.diff(endDate2, 'day') > 0 ? date2 = endDate2 : date2 = endDate1
            }


            const daysWorkedTogether = (Math.abs(date1.diff(date2, 'day')))
            parsedCsvData.push({ emp1: employee1, emp2: employee2, pId: key, days: daysWorkedTogether })
        }
    })


    parsedCsvData.sort((project1, project2) => {
        const project1Days = project1.days
        const project2Days = project2.days
        return project2Days - project1Days
    })


    return (
        <div {...getRootProps()} className="p-2 cursor-pointer">
            <input {...getInputProps()} type="file" accept=".csv" className="p-2"/>
            <p className="p-2">Click here to upload CSV files...</p>
            <ResultsTable parsedData={parsedCsvData} />
        </div>
    )
}