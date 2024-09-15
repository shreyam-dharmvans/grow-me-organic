import './App.css'
import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import { useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { FaAngleDown } from "react-icons/fa6";





interface dataType {
  title: string,
  place_of_origin: string,
  artist_display: string,
  inscriptions: string,
  date_start: Date,
  date_end: Date,
  id: number
}


function App() {
  const [data, setData] = useState<Array<dataType>>([]);
  const [page, setPage] = useState<number>(1);
  const [oldPage, setOldPage] = useState<number>(0)


  const [selectedProducts, setSelectedProducts] = useState<dataType[] | null>(null);
  const [rowClick, setRowClick] = useState<boolean>(true);

  const op = useRef<OverlayPanel>(null);

  const [downRefValue, setDownSelect] = useState<number>(0)
  const downRef = useRef<any>(null);


  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setPage(event.page + 1);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        toast.loading("fetching data", { id: "data" })
        let res = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`)
        // console.log(res.data.data)
        let arr: Array<dataType> = res.data.data;

        arr = arr.map((obj) => {
          return {
            title: obj.title,
            place_of_origin: obj.place_of_origin,
            artist_display: obj.artist_display,
            inscriptions: obj.inscriptions,
            date_start: obj.date_start,
            date_end: obj.date_end,
            id: obj.id
          }
        })
        // console.log(arr)

        setData(arr);
        if (page - 1 == oldPage) {
          let tmp = selectedProducts;

          for (let i = 0; i < downRefValue; i++) {
            // if (!selectedProducts?.includes(data[i])) {
            tmp?.push(arr[i])
            // }
          }
          console.log(tmp)
          console.log(downRefValue)

          setSelectedProducts(tmp);
          setDownSelect(0);
        }

        toast.success("data fetched", { id: "data" })
      } catch (error) {
        console.log(error)
        toast.error("Some error occurred", { id: "data" })
      }

    }

    getData()
  }, [page]);

  // const handleSelect = (value: Array<dataType>) => {
  //   // let obj = arr[0]
  //   // console.log(obj.id)
  //   // console.log(selectedProducts)

  //   // selectedProducts?.push(obj)
  //   console.log(value)
  //   setSelectedProducts(value)
  // }



  const handleSubmitDown = () => {
    let arr: Array<dataType> = []


    if (data.length >= downRef?.current?.value) {
      for (let i = 0; i < downRef?.current?.value; i++) {
        //if (!(selectedProducts?.includes(data[i]))) {
        arr.push(data[i])
        // console.log(selectedProducts)
        // }
      }

      setSelectedProducts(arr);
      setDownSelect(0);
    } else {

      data.map((obj) => {
        //if (!selectedProducts?.includes(obj)) {
        arr.push(obj)
        // }
      })

      setSelectedProducts(arr);
      setDownSelect(downRef?.current?.value - 12)
      setOldPage(page)
    }

    console.log(selectedProducts)
    console.log(downRef?.current?.value)

    console.log("submit down");
  }



  return (
    <div className=''>
      <div className="card">
        <div className="card flex justify-content-center">
          <button className="down-btn" onClick={(e) => op?.current?.toggle(e)}><FaAngleDown /></button>
          <OverlayPanel ref={op}>
            <div className='overlay-container'>
              <input className='overlay-inp' type="number" ref={downRef} placeholder='Select rows...' />
              <button onClick={handleSubmitDown} className='overlay-btn'>submit</button>
            </div>
          </OverlayPanel>
        </div>
        <DataTable value={data} rows={20} selectionMode={rowClick ? undefined : 'multiple'} selection={selectedProducts!}
          onSelectionChange={(e: any) => setSelectedProducts(e.value)} dataKey="id" tableStyle={{ minWidth: '50rem' }}>
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}>
          </Column>
          <Column field="title" header="Title" style={{ width: '25%' }}></Column>
          <Column field="place_of_origin" header="Place of Origin" style={{ width: '25%' }}></Column>
          <Column field="artist_display" header="Artist Display" style={{ width: '25%' }}></Column>
          <Column field="inscriptions" header="Inscriptions" style={{ width: '25%' }}></Column>
          <Column field="date_start" header="Date Start" style={{ width: '25%' }}></Column>
          <Column field="date_end" header="Date End" style={{ width: '25%' }}></Column>
        </DataTable>
        <div className='card'>
          <Paginator rows={12} first={(page - 1) * 12} totalRecords={120} onPageChange={onPageChange} />
        </div>
      </div>
    </div>
  )
}

export default App
