import { applyDecorators } from '@nestjs/common';
import {
  ApiBodyOptions,
  ApiOperationOptions,
  ApiQueryOptions,
  ApiParamOptions,
  ApiResponseOptions,
  ApiSecurity,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export const SwaggerDecorator = (swaggerOptions: {
  apiKey?: string;
  bearerAuth?: string;
  operations?: ApiOperationOptions;
  body?: ApiBodyOptions;
  query?: ApiQueryOptions;
  params?: ApiParamOptions;
  responses?: ApiResponseOptions[];
}) => {
  return applyDecorators(
    swaggerOptions.apiKey
      ? ApiSecurity(swaggerOptions.apiKey)
      : SwaggerDecorator,
    swaggerOptions.bearerAuth
      ? ApiBearerAuth(swaggerOptions.bearerAuth)
      : SwaggerDecorator,
    ApiOperation(swaggerOptions.operations ?? {}),
    swaggerOptions.body ? ApiBody(swaggerOptions.body) : SwaggerDecorator,
    swaggerOptions.query ? ApiQuery(swaggerOptions.query) : SwaggerDecorator,
    swaggerOptions.params ? ApiParam(swaggerOptions.params) : SwaggerDecorator,
    ...(swaggerOptions.responses ?? []).map((response) =>
      ApiResponse(response),
    ),
  );
};
