//there is no such class for Response as we have for Errors
//but we can write a class for Response to standardise it
class ApiResponse {
    constructor(
        statuscode, data, message = "success"
    ) {
        this.statuscode = statuscode
        this.data = data
        this.message = message
        //informational responses(100-199)
        //Suucessfull responses(200-299)
        //Redirectional messages(300-399)
        //client error responses(400-499)
        //server error responses(500-599)
        this.success = statuscode < 400
    }
}

//export it
export {ApiResponse}