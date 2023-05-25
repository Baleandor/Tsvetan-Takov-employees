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

    const { getRootProps, getInputProps } = useDropzone({ onDrop })
    //look into dropzone optimizing

    const projectData = new Map()

    if (csvData) {

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
            const employeesPairingDates: Array<string> = []
            let firstDateEmployeesPairing
            let secondDateEmployeesPairing
            csvData.map((el) => {
                if (el.includes(employee1) || el.includes(employee2)) {
                    employeesPairingDates.push(el[2], el[3])
                }
            })

            const firstEmployeeStartDate = dayjs(employeesPairingDates[0])

            const secondEmployeeStartDate = dayjs(employeesPairingDates[2])

            if (firstEmployeeStartDate.diff(secondEmployeeStartDate, 'day') > 0) {
                firstDateEmployeesPairing = firstEmployeeStartDate
            } else {
                firstDateEmployeesPairing = secondEmployeeStartDate
            }

            let firstEmployeeEndDate
            if (employeesPairingDates[1] === 'NULL') {
                firstEmployeeEndDate = dayjs()
            } else {
                firstEmployeeEndDate = dayjs(employeesPairingDates[1])
            }

            let secondEmployeeEndDate
            if (employeesPairingDates[3] === 'NULL') {
                secondEmployeeEndDate = dayjs()
            } else {
                secondEmployeeEndDate = dayjs(employeesPairingDates[3])
            }

            if (firstEmployeeEndDate.diff(secondEmployeeEndDate, 'day') < 0) {
                secondDateEmployeesPairing = firstEmployeeEndDate
            } else {
                secondDateEmployeesPairing = secondEmployeeEndDate
            }

            const daysWorkedTogether = secondDateEmployeesPairing.diff(firstDateEmployeesPairing, 'day')

            parsedCsvData.push({ emp1: employee1, emp2: employee2, pId: key, days: daysWorkedTogether })
        }
    })

    console.log('yare yare')
    parsedCsvData.sort((project1, project2) => {
        const project1Days = project1.days
        const project2Days = project2.days
        return project2Days - project1Days
    })


    return (
        <div {...getRootProps()} className="p-2 cursor-pointer">
            <input {...getInputProps()} type="file" accept=".csv" className="p-2" />
            <p className="p-2">Click here to upload CSV files...</p>
            <ResultsTable parsedData={parsedCsvData} />
        </div>
    )
}