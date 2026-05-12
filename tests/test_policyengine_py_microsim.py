from __future__ import annotations

from pathlib import Path

from microdf import MicroSeries

import kypa_calc.microsimulation as microsimulation


def test_aggregate_microsimulation_uses_policyengine_py(monkeypatch) -> None:
    calls = []

    class TinyMicrosimulation:
        def calc(self, variable: str, **kwargs):
            assert variable == "household_count_people"
            assert kwargs == {"period": 2024, "map_to": "household"}
            return MicroSeries([1.0, 3.0], weights=[2.0, 4.0])

    def fake_managed_microsimulation(**kwargs):
        calls.append(kwargs)
        return TinyMicrosimulation()

    monkeypatch.setattr(
        microsimulation.pe.us,
        "managed_microsimulation",
        fake_managed_microsimulation,
    )

    sim = microsimulation._new_us_microsimulation()
    result = microsimulation._calc(
        sim,
        "household_count_people",
        2024,
        map_to="household",
    )

    assert calls == [{"reform": None}]
    assert float(result.sum()) == 14.0
    assert float(result.mean()) == 14.0 / 6.0


def test_aggregate_microsimulation_avoids_manual_weight_variables() -> None:
    source = (
        Path(__file__).resolve().parents[1]
        / "kypa_calc"
        / "microsimulation.py"
    ).read_text()

    forbidden_names = [
        "household" + "_weight",
        "person" + "_weight",
        "tax_unit" + "_weight",
        "spm_unit" + "_weight",
    ]

    for name in forbidden_names:
        assert f'"{name}"' not in source
        assert f"'{name}'" not in source
