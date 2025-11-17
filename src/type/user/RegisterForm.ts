import {z} from "zod";

export const RegisterSehema = z.object({
  full_name: z
    .string()
    .min(2, "Họ và tên phải chứa ít nhất 2 ký tự")
    .nonempty("Họ và tên không được để trống")
    ,
    
  phone: z
    .string()
    .min(10, "Số điện thoại không hợp lệ")
    .max(15, "Số điện thoại không hợp lệ")
    .nonempty("Số điện thoại không được để trống"),

  email: z  
    .email("Địa chỉ email không hợp lệ"),

  password: z
    .string()
    .min(6, "Mật khảu phải chứa ít nhất 6 ký tượng")
    .nonempty("Mật khẩu không được để trống"),
});

export type RegisterInput = z.infer<typeof RegisterSehema>;