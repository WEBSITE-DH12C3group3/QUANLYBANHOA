package com.banhoa.backend.supplier.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SupplierRequest {
    @NotBlank @Size(max = 180)
    private String name;

    @Size(max = 120)
    private String contactName;

    @Size(max = 20)
    private String phone;

    @Email @Size(max = 120)
    private String email;

    @Size(max = 255)
    private String address;

    @Size(max = 50)
    private String taxCode;

    /** trạng thái tùy dùng: active/inactive … */
    @Size(max = 20)
    private String status;

    @Size(max = 255)
    private String note;

    // getters/setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getTaxCode() { return taxCode; }
    public void setTaxCode(String taxCode) { this.taxCode = taxCode; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
