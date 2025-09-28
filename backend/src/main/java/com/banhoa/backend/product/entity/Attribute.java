package com.banhoa.backend.product.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "attributes", uniqueConstraints = {
        @UniqueConstraint(name = "uk_attr_name", columnNames = "name")
})
public class Attribute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "data_type", nullable = false, length = 10)
    private DataType dataType = DataType.TEXT;

    // Đổi tên hằng enum để tránh từ khóa Java
    public enum DataType { TEXT, NUMBER, BOOLEAN, DATE }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public DataType getDataType() { return dataType; }
    public void setDataType(DataType dataType) { this.dataType = dataType; }
}
