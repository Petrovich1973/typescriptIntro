import React, {useState} from 'react'
import moment from 'moment'

const dateFormat: string = '[Date:] DD.MM.YYYY [Time:] HH:mm:ss SSS'

interface Item {
    title: string,
    date: number
}

const App: React.FC = () => {

    const [newItemText, setNewItemText] = useState<string>('')
    const [list, setList] = useState<Item[]>([])
    const [lockList, setLockList] = useState<number[]>([])

    const timeout = (ms: number) => new Promise(res => setTimeout(res, ms))

    const getListNotLock = () => list
        .filter(item => !lockList.includes(item.date))

    const timestampToString = (date: number): string => moment(date)
        .format(dateFormat)

    const onClickAddItem = () => {

        const title = newItemText || 'нет имени'

        setList(prev => [{title, date: Date.now()}, ...prev])

        setNewItemText('')

    }

    const onRemoveItem = async (date: number) => {

        setLockList(prev => [...prev, date])

        await timeout(3000)

        setList(prev => prev.filter(item => item.date !== date))

        setLockList(prev => prev.filter(item => item !== date))

    }

    const onClickRemoveAll = () => {
        getListNotLock()
            .forEach(item => onRemoveItem(item.date))
    }

    return (
        <div className="container">

            <div>
                <input
                    type="text"
                    value={newItemText}
                    onChange={e => setNewItemText(e.target.value)}/>
                <button onClick={onClickAddItem}>Add item</button>
            </div>

            <div className="tools">
                <button
                    disabled={Boolean(!getListNotLock().length)}
                    onClick={onClickRemoveAll}>delete all</button>
            </div>

            {list.map((item: Item, i: number) => {

                const {title, date} = item

                const isLockItem: boolean = lockList.some(el => el === date)

                const _date: string = timestampToString(date)

                return (
                    <p
                        className={`item${isLockItem ? ' process' : ''}`}
                        title={_date}
                        key={i}>
                        <span>
                            <small>
                                <em>
                                    {_date}
                                </em>
                            </small>
                        </span>
                        <span>{title}</span>
                        <button
                            disabled={isLockItem}
                            onClick={() => onRemoveItem(date)}>remove
                        </button>
                    </p>
                )
            })}

        </div>
    )
}

export default App
