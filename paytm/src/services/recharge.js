import api from "@/lib/axios"


export const createRecharge = (data)=>{
    return api.post("/recharge" , data)
}

export const getRecharges = (filters)=>{
    return api.get("/recharge" , {params:filters})
}