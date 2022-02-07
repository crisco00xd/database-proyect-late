import json


class Utilities:

    @staticmethod
    def to_dict(obj):
        res = {column.key: getattr(obj, attr)
               for attr, column in obj.__mapper__.c.items()}
        return res

    @staticmethod
    def verify_parameters(jsonP, params):
        for param, value in jsonP.items():
            if param in params and value is None:
                return None
        return jsonP

    @staticmethod
    def raw_sql_to_dict(obj):
        return obj._asdict()

    @staticmethod
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)
