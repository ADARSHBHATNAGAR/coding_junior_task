import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';

interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

const TableComponent = () => {
    const [data, setData] = useState<Artwork[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);  // This state is used for rows per page

    // Fetch data when page changes
    useEffect(() => {
        fetchData(first / rows + 1, rows);  // Pass rows instead of 'rowsPerPage'
    }, [first]);

    const fetchData = async (page: number, _rows: number) => {  // Adjusted to remove rowsPerPage
        setLoading(true);
        try {
            const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
            const artworks = response.data.data.map((item: any) => ({
                id: item.id,
                title: item.title,
                place_of_origin: item.place_of_origin,
                artist_display: item.artist_display,
                inscriptions: item.inscriptions,
                date_start: item.date_start,
                date_end: item.date_end,
            }));

            setData(artworks);
            setTotalRecords(response.data.pagination.total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const onPageChange = (e: { first: number; rows: number }) => {
        setFirst(e.first);
        setRows(e.rows);  // This will trigger a fetch for new rows
    };

    const onRowSelect = (e: any) => {
        setSelectedRows([...selectedRows, e.data]);
    };

    const onRowUnselect = (e: any) => {
        setSelectedRows(selectedRows.filter(row => row.id !== e.data.id));
    };

    return (
        <div>
            <DataTable
                value={data}
                paginator
                rows={rows}
                totalRecords={totalRecords}
                lazy
                loading={loading}
                first={first}
                onPage={onPageChange}
                selection={selectedRows}
                onSelectionChange={(e) => setSelectedRows(e.value)}
                dataKey="id"
                selectionMode="checkbox"
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="title" header="Title"></Column>
                <Column field="place_of_origin" header="Place of Origin"></Column>
                <Column field="artist_display" header="Artist Display"></Column>
                <Column field="inscriptions" header="Inscriptions"></Column>
                <Column field="date_start" header="Date Start"></Column>
                <Column field="date_end" header="Date End"></Column>
            </DataTable>
        </div>
    );
};

export default TableComponent;
