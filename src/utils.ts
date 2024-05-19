import { z } from 'zod'

export const ADDRESS_REGEX = /(0x[a-fA-F0-9]{40})/g

const schema = z.object({
  chainId: z.number().gte(1).lte(1000),
  address: z.string().regex(ADDRESS_REGEX),
  abi: z.string().array(),
  functionName: z.string(),
  args: z.any().array().optional()
})


export const getSchemaError = (data: any) => {
  const response = schema.safeParse(data);
  if (!response.success) {
    return response.error;
  }

  return null
}

