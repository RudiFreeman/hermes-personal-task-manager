"""Native Hermes plugin entry point. Registration never modifies task data."""
def register(ctx):
    from .backend import tools

    for name, schema in tools.SCHEMAS.items():
        ctx.register_tool(name=name, toolset="personal_tasks", schema=schema,
                          handler=getattr(tools, name))
