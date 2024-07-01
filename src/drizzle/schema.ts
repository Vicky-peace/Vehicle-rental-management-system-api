import { pgTable, serial, varchar, text, integer, boolean, timestamp, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum Definitions
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const bookingEnum = pgEnum("booking_status", ["Pending", "Confirmed", "Cancelled", "Completed"]);
export const payMentEnum = pgEnum("payment_status", ["Pending", "Completed", "Refunded"]);

// Users Table
export const Users = pgTable('users', {
    user_id: serial('user_id').primaryKey(),
    full_name: varchar('full_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    contact_phone: varchar('contact_phone', { length: 15 }),
    address: text('address'),
    role: roleEnum("role").default("user"),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

// Vehicle Specifications Table
export const VehicleSpecifications = pgTable('vehicle_specifications', {
    vehicle_id: serial('vehicle_id').primaryKey(),
    manufacturer: varchar('manufacturer', { length: 255 }).notNull(),
    model: varchar('model', { length: 255 }).notNull(),
    year: integer('year').notNull(),
    fuel_type: varchar('fuel_type', { length: 50 }).notNull(),
    engine_capacity: varchar('engine_capacity', { length: 50 }),
    transmission: varchar('transmission', { length: 50 }),
    seating_capacity: integer('seating_capacity'),
    color: varchar('color', { length: 50 }),
    features: text('features'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

// Vehicles Table
export const Vehicles = pgTable('vehicles', {
    vehicleSpec_id: serial('vehicleSpec_id').primaryKey(),
    vehicle_id: integer('vehicle_id').references(() => VehicleSpecifications.vehicle_id, { onDelete: 'cascade' }),
    rental_rate: decimal('rental_rate').notNull(),
    availability: boolean('availability').default(true),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

// Bookings Table
export const Bookings = pgTable('bookings', {
    booking_id: serial('booking_id').primaryKey(),
    user_id: integer('user_id').references(() => Users.user_id, { onDelete: 'cascade' }),
    vehicle_id: integer('vehicle_id').references(() => Vehicles.vehicleSpec_id, { onDelete: 'cascade' }),
    location_id: integer('location_id').references(() => LocationsAndBranches.location_id, { onDelete: 'cascade' }),
    booking_date: timestamp('booking_date').notNull(),
    return_date: timestamp('return_date').notNull(),
    total_amount: decimal('total_amount').notNull(),
    booking_status: bookingEnum("booking_status").default("Pending"),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

// Payments Table
export const Payments = pgTable('payments', {
    payment_id: serial('payment_id').primaryKey(),
    booking_id: integer('booking_id').references(() => Bookings.booking_id, { onDelete: 'cascade' }),
    amount: decimal('amount').notNull(),
    payment_status: payMentEnum("payment_status").default("Pending"),
    payment_date: timestamp('payment_date'),
    payment_method: varchar('payment_method', { length: 255 }),
    transaction_id: varchar('transaction_id', { length: 255 }),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

// Authentication Table
export const Authentication = pgTable('authentication', {
    auth_id: serial('auth_id').primaryKey(),
    user_id: integer('user_id').references(() => Users.user_id, { onDelete: 'cascade' }),
    password: varchar('password', { length: 255 }).notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

// Customer Support Tickets Table
export const CustomerSupportTickets = pgTable('customer_support_tickets', {
    ticket_id: serial('ticket_id').primaryKey(),
    user_id: integer('user_id').references(() => Users.user_id, { onDelete: 'cascade' }),
    subject: varchar('subject', { length: 255 }).notNull(),
    description: text('description').notNull(),
    status: varchar('status', { length: 50 }).notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

// Locations and Branches Table
export const LocationsAndBranches = pgTable('locations_and_branches', {
    location_id: serial('location_id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    address: text('address').notNull(),
    contact_phone: varchar('contact_phone', { length: 15 }),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

// Fleet Management Table
export const FleetManagement = pgTable('fleet_management', {
    fleet_id: serial('fleet_id').primaryKey(),
    vehicle_id: integer('vehicle_id').references(() => VehicleSpecifications.vehicle_id, { onDelete: 'cascade' }),
    acquisition_date: timestamp('acquisition_date').notNull(),
    depreciation_rate: decimal('depreciation_rate').notNull(),
    current_value: decimal('current_value').notNull(),
    maintenance_cost: decimal('maintenance_cost').notNull(),
    status: varchar('status', { length: 50 }).notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

// Relationships
export const userAuthRelations = relations(Users, ({ one }) => ({
    auth: one(Authentication, {
        fields: [Users.user_id],
        references: [Authentication.user_id]
    })
}));

export const authRelations = relations(Authentication, ({ one }) => ({
    user: one(Users, {
        fields: [Authentication.user_id],
        references: [Users.user_id]
    })
}));

export const userBookingsRelations = relations(Users, ({ many }) => ({
    bookings: many(Bookings),
    supportTickets: many(CustomerSupportTickets),
}));

export const vehicleSpecRelations = relations(VehicleSpecifications, ({ one, many }) => ({
    vehicles: many(Vehicles),
    fleet: one(FleetManagement, {
        fields: [VehicleSpecifications.vehicle_id],
        references: [FleetManagement.vehicle_id]
    })
}));

export const vehicleRelations = relations(Vehicles, ({ one }) => ({
    vehicleSpec: one(VehicleSpecifications, {
        fields: [Vehicles.vehicle_id],
        references: [VehicleSpecifications.vehicle_id]
    }),
    bookings: one(Bookings, {
        fields: [Vehicles.vehicleSpec_id],
        references: [Bookings.vehicle_id]
    })
}));

export const bookingRelations = relations(Bookings, ({ one }) => ({
    user: one(Users, {
        fields: [Bookings.user_id],
        references: [Users.user_id]
    }),
    vehicle: one(Vehicles, {
        fields: [Bookings.vehicle_id],
        references: [Vehicles.vehicleSpec_id]
    }),
    location: one(LocationsAndBranches, {
        fields: [Bookings.location_id],
        references: [LocationsAndBranches.location_id]
    }),
    payments: one(Payments, {
        fields: [Bookings.booking_id],
        references: [Payments.booking_id]
    })
}));

export const paymentRelations = relations(Payments, ({ one }) => ({
    booking: one(Bookings, {
        fields: [Payments.booking_id],
        references: [Bookings.booking_id]
    })
}));

export const customerSupportRelations = relations(CustomerSupportTickets, ({ one }) => ({
    user: one(Users, {
        fields: [CustomerSupportTickets.user_id],
        references: [Users.user_id]
    })
}));

export const locationRelations = relations(LocationsAndBranches, ({ many }) => ({
    bookings: many(Bookings)
}));

export const fleetRelations = relations(FleetManagement, ({ one }) => ({
    vehicleSpec: one(VehicleSpecifications, {
        fields: [FleetManagement.vehicle_id],
        references: [VehicleSpecifications.vehicle_id]
    })
}));



export type TIUsers = typeof Users.$inferInsert;
export type TSUsers = typeof Users.$inferSelect;
export type  TIVehicleSpecifications = typeof VehicleSpecifications.$inferInsert;
export type TSVehicleSpecifications = typeof VehicleSpecifications.$inferSelect;
export type TIVehicles = typeof Vehicles.$inferInsert;
export type TSVehicles = typeof Vehicles.$inferSelect;
export type TIBookings = typeof Bookings.$inferInsert;
export type TSBookings = typeof Bookings.$inferSelect;
export type TIPayments = typeof Payments.$inferInsert;
export type TSPayments = typeof Payments.$inferSelect;
export type TILocationsAndBranches = typeof LocationsAndBranches.$inferInsert;
export type TSLocationGAndBranches = typeof LocationsAndBranches.$inferSelect;