import { z } from 'zod'

export const ADDRESS_REGEX = /(0x[a-fA-F0-9]{40})/g

const transactionDataSchema = z.object({
  chainId: z.number().gte(1).lte(1000),
  address: z.string().regex(ADDRESS_REGEX),
  abi: z.string().array(),
  functionName: z.string(),
  args: z.any().array().optional()
})

const domainSchema = z.object({
  name: z.string(),
  version: z.string(),
  chainId: z.number(),
  verifyingContract: z.string()
})

const signMessageDataSchema = z.object({
  domain: domainSchema,
  primaryType: z.string(),
  types: z.object({}),
  message: z.object({})
})


export const getSchemaError = (operationType: string, data: any) => {
  const schema = operationType === "signature" ? signMessageDataSchema : transactionDataSchema;
  const response = schema.safeParse(JSON.parse(JSON.stringify(data)));
  if (!response.success) {
    return response.error;
  }

  return null
}

