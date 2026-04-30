from pathlib import Path


def test_repository_has_required_ci_files() -> None:
    root = Path(__file__).resolve().parents[3]

    workflow = root / ".github" / "workflows" / "ci-cd-basic.yml"
    readme = root / "README.md"

    assert workflow.exists(), "CI workflow file is missing"
    assert readme.exists(), "README.md is missing"


def test_source_directories_exist() -> None:
    root = Path(__file__).resolve().parents[3]
    assert (root / "app").is_dir(), "app directory should exist"
    assert (root / "configs").is_dir(), "configs directory should exist"