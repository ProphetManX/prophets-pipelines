from __future__ import annotations

import argparse
import sqlite3
from contextlib import closing
from pathlib import Path

from .journal import Journal, JournalError, SCHEMA_VERSION


def migrate_with_backup(database: Path, backup: Path) -> None:
    if not database.is_file():
        raise JournalError("Migration requires an existing journal database.")
    with closing(sqlite3.connect(database.as_uri() + "?mode=ro", uri=True)) as source:
        version = source.execute("PRAGMA user_version").fetchone()[0]
        if version == SCHEMA_VERSION:
            print(f"Journal is already at schema {SCHEMA_VERSION}; no migration needed.")
            return
        if version != 1:
            raise JournalError(f"Journal schema version {version} is unsupported.")
        with backup.open("xb"):
            pass
        with closing(sqlite3.connect(backup)) as target:
            source.backup(target)
    Journal.migrate(database)
    print(f"Journal migrated from schema 1 to {SCHEMA_VERSION}. Backup: {backup}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Explicit journal maintenance migration. Stop workers and dashboard first.")
    parser.add_argument("--database", required=True, type=Path)
    parser.add_argument("--backup", required=True, type=Path)
    options = parser.parse_args()
    try:
        migrate_with_backup(options.database.resolve(), options.backup.resolve())
    except (JournalError, OSError, sqlite3.Error) as error:
        parser.exit(1, f"Migration failed: {error}\n")


if __name__ == "__main__":
    main()
