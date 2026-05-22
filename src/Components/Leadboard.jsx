import { useEffect, useState } from "react";
import Header from "./Header";

export default function Leadboard() {
    const [records, setRecords] = useState([])
    const [selectedId, setSelectedId] = useState('')
    const [selectedRecord] = records.filter(record => record.id === selectedId)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('http://localhost:3000/leadboard')
            .then(res => res.json())
            .then(res => {
                setRecords(res.records)
                setSelectedId(res.records[0].id)
                setIsLoading(false)
            })
    }, [])


    function handleClick(e) {
        setSelectedId(e.target.dataset.id)
    }

    if(isLoading) return <h1>Loading...</h1>

    return (
        <>
            <Header />
            <ul>
                {records.map(record => <li onClick={handleClick} data-id={record.id} key={record.id}><img data-id={record.id} src={record.url} alt="img" style={{width: '100px', filter: record.id === selectedId ? 'brightness(1) grayscale(0)' : 'brightness(.3) grayscale(90%)'}} /></li>)}
            </ul>
            <table>
                <thead>
                    <tr>
                        <th>rank</th>
                        <th>name</th>
                        <th>time</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedRecord.records.map((record, index) => {
                        return (
                            <tr key={record.id}>
                                <th>{index + 1}</th>
                                <th>{record.name}</th>
                                <th>{record.time}</th>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}