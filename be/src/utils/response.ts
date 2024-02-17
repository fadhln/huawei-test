import { Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { APIResponse } from "./apiresponse";

function isStatusOK(status: number) {
  return status >= 200 && status < 300;
}

function isStatusError(status: number) {
  return status >= 400 && status < 600;
}

function sendResponse(
  res: Response,
  message: string,
  status: number,
  data?: any
) {
  const content = data ?? null;
  const response: APIResponse = {
    content,
    message,
  };
  return res.status(status).json(response);
}

function successResponse(res: Response, data?: any, status?: number) {
  const statusCode = isStatusOK(Number(status))
    ? Number(status)
    : StatusCodes.OK;

  return sendResponse(res, "success", statusCode, data);
}

function errorResponse(
  res: Response,
  data?: any,
  message?: string,
  status?: number
) {
  const statusCode = isStatusError(Number(status))
    ? Number(status)
    : StatusCodes.INTERNAL_SERVER_ERROR;
  const msg =
    typeof message === "string" ? message : getReasonPhrase(statusCode);

  return sendResponse(res, msg, statusCode, data);
}

export { successResponse, errorResponse };
