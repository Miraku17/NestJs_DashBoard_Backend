import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";
import { Form } from "../forms/forms.entity";

@Entity({name: 'companies'})

export class Company{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length:100, unique:true})
    name:string;

    @OneToMany(() => Form, (form) => form.company)
    forms: Form[];

    @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

}