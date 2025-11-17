import { z } from "zod";

export const LoginSchema = z.object({
  email: z  
    .email("Địa chỉ email không hợp lệ"),

  password: z
    .string()
    .nonempty("Mật khẩu không được để trống"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
