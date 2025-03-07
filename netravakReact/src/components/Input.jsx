

export function Input({ placeholder, reference, type}){
    return <div>
        <input placeholder={placeholder} ref={reference} type={type} className="px-4
        border rounded-sm m-2 py-2 outline-1 outline-charcoal-dark placeholder-charcoal-light">
        </input>
    </div>
}