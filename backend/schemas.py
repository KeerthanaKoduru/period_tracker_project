from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.Int()
    username = fields.Str()

class SymptomSchema(Schema):
    id = fields.Int()
    cycle_id = fields.Int()
    name = fields.Str()
    severity = fields.Int()
    created_at = fields.DateTime()

class ReminderSchema(Schema):
    id = fields.Int()
    cycle_id = fields.Int()
    title = fields.Str()
    scheduled_for = fields.DateTime()
    notes = fields.Str()
    created_at = fields.DateTime()

class CycleSchema(Schema):
    id = fields.Int()
    user_id = fields.Int()
    start_date = fields.Date()
    end_date = fields.Date(allow_none=True)
    notes = fields.Str(allow_none=True)
    created_at = fields.DateTime(allow_none=True)
    symptoms = fields.List(fields.Nested(SymptomSchema),allow_none=True)
    reminders = fields.List(fields.Nested(ReminderSchema),allow_none=True)
